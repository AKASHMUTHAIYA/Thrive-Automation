# Kudos Test Cases — Product Context

## What Kudos Covers

The **Kudos** module handles employee recognition and awards. It includes highfive cards, award creation (fixed/variable points), multi-level approval workflows, award configuration, and grant workflows.

| Feature | URL Path | Description |
|---|---|---|
| Kudos Feed | `/kudos` | Recognition feed, highfives |
| Awards | `/kudos/awards` | Award list, create, configure |
| Award Config | `/kudos/awards/configure` | Points, approval levels, givers/receivers |
| Leaderboard | `/kudos/leaderboard` | Points leaderboard |

## Key Page Objects

| POManager getter | Page Object | Purpose |
|---|---|---|
| `getKudosPage()` | Kudos | Highfive, recognition feed, awards, and config |

## Common Test Patterns

```javascript
const kudosPage = poManager.getKudosPage();

// Create award
await kudosPage.createAward({
    awardName: `Award_${Date.now()}`,
    pointsType: "fixed",
    points: 150,
    givers: ["Manager A"],
    receivers: ["Team B"],
    approverConfig: { type: "manual", levels: [{ level: 1, approvers: ["HR Admin"] }] },
});

// Grant award to employee
await kudosPage.grantAward(awardName, employeeName);

// Verify award in feed
await kudosPage.verifyAwardInFeed(awardName, employeeName);

// Configure award settings
await kudosPage.enableOrDisableAwardConfiguration("Points Budget", true);
```

## Key Characteristics

- Awards can have **fixed or variable points**
- **Multi-level approval** — up to N levels of approvers before award is granted
- **Givers and receivers** are configured per award (specific employees, departments, or "everyone")
- Approval workflow: grant request > approver review > approved/rejected
- Points accumulate on the **leaderboard**
