/**
 * Determines if the next form will be an attention check
 *
 * @param submissionCount number of current submissions
 * @param attentionChecks attention checks of the user
 * @param attentionCheckPoints number, after which submission a new attention check is created
 */
export function isAttCheck(
  submissionCount: number,
  attentionChecks: number,
  attentionCheckPoints = [15, 30, 45]
): boolean {
  return (
    (submissionCount == attentionCheckPoints[0] && attentionChecks == 0) ||
    (submissionCount == attentionCheckPoints[1] && attentionChecks == 1) ||
    (submissionCount == attentionCheckPoints[2] && attentionChecks == 2)
  );
}
