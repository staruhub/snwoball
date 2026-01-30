## 1. Service Layer - AbortSignal Support

- [ ] 1.1 Modify `getComprehensiveMetrics` in `services/fund.ts` to accept optional `signal?: AbortSignal` parameter and pass it to the `get` call
- [ ] 1.2 Modify `getPerformanceComparison` in `services/fund.ts` to accept optional `signal?: AbortSignal` parameter and pass it to the `get` call

## 2. PerformanceMetricsPanel - 422 Error Handling

- [ ] 2.1 Import `HttpError` type from `@ratel/types/error`
- [ ] 2.2 Add `insufficientData` state: `const [insufficientData, setInsufficientData] = useState(false)`
- [ ] 2.3 Modify `fetchMetrics` catch block to detect 422 + "数据不足" and set `insufficientData` instead of `error`
- [ ] 2.4 Add UI rendering branch for `insufficientData` state showing friendly guidance message
- [ ] 2.5 Reset `insufficientData` to false when fund changes (in the existing fund change useEffect)

## 3. PerformanceMetricsPanel - AbortSignal Propagation

- [ ] 3.1 Update `fetchMetrics` to pass `signal` parameter to `getComprehensiveMetrics` call

## 4. FundDetailPanel - 422 Error Handling

- [ ] 4.1 Add `insufficientData` state for performance comparison data
- [ ] 4.2 Modify `fetchPerformanceComparison` catch block to detect 422 + "数据不足"
- [ ] 4.3 Add UI rendering for insufficient data state in the chart area
- [ ] 4.4 Optionally add AbortSignal support to performance comparison fetch (if rapid filter changes are an issue)

## 5. Testing & Verification

- [ ] 5.1 Test with short time range (e.g., "近一月") to verify no toast appears
- [ ] 5.2 Test with newly established fund to verify friendly message displays
- [ ] 5.3 Test rapid filter changes to verify previous requests are cancelled (check Network tab)
- [ ] 5.4 Test that other 422 errors (not "数据不足") still show error toast
