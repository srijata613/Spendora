import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export default function EmailTemplate({
  userName = "",
  type = "monthly-report",
  data = {},
}) {
  const percentageUsed = Number(data?.percentageUsed ?? 0);
  const budgetAmount = Number(data?.budgetAmount ?? 0);
  const totalExpenses = Number(data?.totalExpenses ?? 0);

  const totalIncome = Number(data?.stats?.totalIncome ?? 0);
  const totalExpenseStats = Number(data?.stats?.totalExpenses ?? 0);

  const categories = data?.stats?.byCategory || {};
  const insights = Array.isArray(data?.insights) ? data.insights : [];

  if (type === "monthly-report") {
    return (
      <Html>
        <Head />
        <Preview>Your Monthly Financial Report</Preview>

        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Monthly Financial Report</Heading>

            <Text style={styles.text}>Hello {userName || "there"},</Text>

            <Text style={styles.text}>
              Here’s your financial summary for {data?.month ?? "this month"}:
            </Text>

            {/* Main Stats */}
            <Section style={styles.statsContainer}>
              <div style={styles.card}>
                <Text style={styles.cardLabel}>Total Income</Text>
                <Text style={styles.cardValue}>${totalIncome}</Text>
              </div>

              <div style={styles.card}>
                <Text style={styles.cardLabel}>Total Expenses</Text>
                <Text style={styles.cardValue}>${totalExpenseStats}</Text>
              </div>

              <div style={styles.card}>
                <Text style={styles.cardLabel}>Net</Text>
                <Text style={styles.cardValue}>
                  ${totalIncome - totalExpenseStats}
                </Text>
              </div>
            </Section>

            {/* Category Breakdown */}
            {Object.keys(categories).length > 0 && (
              <Section style={styles.section}>
                <Heading style={styles.heading}>Expenses by Category</Heading>

                {Object.entries(categories).map(([category, amount]) => (
                  <div key={category} style={styles.row}>
                    <Text style={styles.text}>{category}</Text>
                    <Text style={styles.text}>${Number(amount ?? 0)}</Text>
                  </div>
                ))}
              </Section>
            )}

            {/* AI Insights */}
            {insights.length > 0 && (
              <Section style={styles.section}>
                <Heading style={styles.heading}>Spendora Insights</Heading>

                {insights.map((insight, index) => (
                  <Text key={index} style={styles.text}>
                    • {insight}
                  </Text>
                ))}
              </Section>
            )}

            <Text style={styles.footer}>
              Thank you for using Spendora. Keep tracking your finances for
              better financial health!
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }

  if (type === "budget-alert") {
    const remaining = budgetAmount - totalExpenses;

    const progressColor =
      percentageUsed >= 90
        ? "#ef4444"
        : percentageUsed >= 75
        ? "#f59e0b"
        : "#10b981";

    return (
      <Html>
        <Head />
        <Preview>Budget Alert</Preview>

        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Budget Alert</Heading>

            <Text style={styles.text}>Hello {userName || "there"},</Text>

            <Text style={styles.subtitle}>
              You’ve used {percentageUsed.toFixed(1)}% of your monthly budget.
            </Text>

            {/* Progress Bar */}
            <Section style={styles.progressWrapper}>
              <div style={styles.progressBackground}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${Math.min(percentageUsed, 100)}%`,
                    backgroundColor: progressColor,
                  }}
                />
              </div>

              <Text style={styles.progressLabel}>
                {percentageUsed.toFixed(1)}% used
              </Text>
            </Section>

            {/* Budget Cards */}
            <Section style={styles.statsContainer}>
              <div style={styles.card}>
                <Text style={styles.cardLabel}>Budget Amount</Text>
                <Text style={styles.cardValue}>${budgetAmount}</Text>
              </div>

              <div style={styles.card}>
                <Text style={styles.cardLabel}>Spent So Far</Text>
                <Text style={styles.cardValue}>${totalExpenses}</Text>
              </div>

              <div style={styles.card}>
                <Text style={styles.cardLabel}>Remaining</Text>
                <Text style={styles.cardValue}>${remaining}</Text>
              </div>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }

  // fallback
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Text>Email template error: unknown type</Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#f3f4f6",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    padding: "40px 0",
  },

  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "30px",
    borderRadius: "8px",
    maxWidth: "520px",
  },

  title: {
    fontSize: "32px",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "20px",
    color: "#111827",
  },

  heading: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "10px",
  },

  text: {
    fontSize: "16px",
    color: "#374151",
    marginBottom: "10px",
  },

  subtitle: {
    fontSize: "16px",
    color: "#6b7280",
    marginBottom: "25px",
  },

  section: {
    marginTop: "25px",
  },

  statsContainer: {
    marginTop: "20px",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "6px",
    padding: "18px",
    marginBottom: "15px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
  },

  cardLabel: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "6px",
  },

  cardValue: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#111827",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
  },

  footer: {
    marginTop: "30px",
    fontSize: "14px",
    color: "#6b7280",
    textAlign: "center",
  },

  progressWrapper: {
    marginBottom: "25px",
  },

  progressBackground: {
    width: "100%",
    height: "10px",
    backgroundColor: "#e5e7eb",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressFill: {
    height: "10px",
    borderRadius: "999px",
  },

  progressLabel: {
    fontSize: "13px",
    color: "#6b7280",
    marginTop: "8px",
  },
};