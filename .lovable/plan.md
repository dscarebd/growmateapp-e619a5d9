

## Bug: Decimal reward values truncated to integers

The issue is in `src/pages/CreateCampaign.tsx`. The code uses `parseInt()` to parse the reward value, which truncates `0.01` to `0` (then defaults to `1` via `|| 1`):

```ts
const rewardNum = parseInt(reward) || 1;  // parseInt("0.01") = 0, then || 1 = 1
const budgetNum = parseInt(budget) || 0;
```

### Fix

Change `parseInt` to `parseFloat` for both `budget` and `reward` so decimal values like `0.01` are preserved:

```ts
const budgetNum = parseFloat(budget) || 0;
const rewardNum = parseFloat(reward) || 1;
```

This single change in `src/pages/CreateCampaign.tsx` fixes the display and calculation for decimal credit amounts.

