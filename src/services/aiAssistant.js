import axios from 'axios';
import { analyzeAssetRisk } from './threatEngine';

const SYSTEM_PROMPT = `You are an enterprise cybersecurity analyst assistant for a SOC platform.
Provide concise, actionable security analysis. Include threat explanation, risk analysis, and remediation steps.
Keep responses under 200 words. Use bullet points when helpful.`;

function buildLocalResponse(question, context) {
  const q = question.toLowerCase();
  const assetMatch = q.match(/server-\d+|workstation-\d+|cloud-storage-prod/);

  if (assetMatch && context.assets?.length) {
    const assetName = assetMatch[0];
    const asset = context.assets.find((a) => a.name === assetName);
    if (asset) {
      const analysis = analyzeAssetRisk(
        asset,
        context.threats || [],
        context.vulnerabilities || [],
        context.alerts || []
      );

      return {
        source: 'local-engine',
        content: `## Risk Analysis: ${assetName}

**Risk Score:** ${analysis.riskScore}/100 (${analysis.riskLevel.level})

### Threat Explanation
${assetName} is classified as **${asset.type}** with ${asset.exposure} exposure. We detected **${analysis.threatCount}** active threats and **${analysis.vulnCount}** vulnerabilities.

${analysis.topThreats.length ? `Recent threats include: ${analysis.topThreats.map((t) => t.threatType || t.title).join(', ')}.` : 'No direct threat bindings in the last window.'}

${analysis.correlations.length ? `### Correlation Engine\n${analysis.correlations.map((c) => `- **${c.name}** (${c.confidence}% confidence): ${c.action}`).join('\n')}` : ''}

### Recommended Remediation
${analysis.remediation}`,
      };
    }
  }

  if (q.includes('risk score') || q.includes('dashboard')) {
    return {
      source: 'local-engine',
      content: `## Platform Risk Overview

Current aggregate risk is driven by **${context.alerts?.filter((a) => a.severity === 'critical').length || 0}** critical alerts and **${context.threats?.length || 0}** tracked threats.

**Priority actions:**
- Review critical alerts in the Active Alerts feed
- Patch vulnerabilities with CVSS ≥ 9.0
- Enable MFA on externally exposed assets
- Run correlation analysis on server-3 (highest asset risk)`,
    };
  }

  if (q.includes('ransomware') || q.includes('malware')) {
    return {
      source: 'local-engine',
      content: `## Malware / Ransomware Posture

Based on current telemetry:
- **${context.threats?.filter((t) => t.threatType === 'Ransomware' || t.threatType === 'Malware').length || 0}** related events in the last period
- EDR and SIEM sources are actively monitoring lateral movement patterns

**Remediation:**
1. Verify backup integrity and offline copies
2. Segment high-risk assets (server-3, cloud-storage-prod)
3. Block known malicious IPs at the firewall edge
4. Initiate IR playbook if encryption behavior is detected`,
    };
  }

  return {
    source: 'local-engine',
    content: `## Security Assistant

I can help analyze threats, asset risk, and remediation strategies.

**Try asking:**
- "Why is server-3 risky?"
- "What is our current risk score?"
- "How do we respond to ransomware threats?"

I'm running in **local intelligence mode** with full access to your Firestore threat data.`,
  };
}

export async function askSecurityAssistant(question, context) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    return buildLocalResponse(question, context);
  }

  try {
    const contextSummary = JSON.stringify({
      threatCount: context.threats?.length,
      alertCount: context.alerts?.length,
      assets: context.assets?.map((a) => ({ name: a.name, riskScore: a.riskScore })),
      topAlerts: context.alerts?.slice(0, 5).map((a) => a.title),
    });

    const { data } = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Context: ${contextSummary}\n\nQuestion: ${question}`,
          },
        ],
        max_tokens: 500,
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    );

    return {
      source: 'openai',
      content: data.choices?.[0]?.message?.content || buildLocalResponse(question, context).content,
    };
  } catch (err) {
    const isQuota =
      err?.response?.status === 429 ||
      err?.response?.data?.error?.code === 'insufficient_quota';

    const local = buildLocalResponse(question, context);
    return {
      ...local,
      fallback: true,
      fallbackReason: isQuota
        ? 'API quota exceeded — using local threat intelligence engine'
        : 'AI service unavailable — using local threat intelligence engine',
    };
  }
}
