import type { OrderType } from '../../types'
import { OrderFlags } from '../../types'

export function parseOrderFlags (item: OrderType): {
  clientRequest: boolean;
  draft: boolean;
  created: boolean;
  sent: boolean;
  cancelled: boolean;
  confirmed: boolean;
  preOpening: boolean;
  failed: boolean;
  cancelRequest: boolean;
  editRequest: boolean;
  canEdit: boolean;
  canDelete: boolean;
} {
  const flag = item.flags ?? 0
  const failed = (flag & OrderFlags.FAILED) !== 0
  const draft = (flag & OrderFlags.Draft) !== 0
  const sent = (flag & OrderFlags.Sent) !== 0
  const confirmed = (flag & OrderFlags.Confirmed) !== 0
  const cancelled = (flag & OrderFlags.Cancelled) !== 0
  const cancelRequest = (flag & OrderFlags.CANCEL_REQUEST) !== 0
  const editRequest = (flag & OrderFlags.EDIT_REQUEST) !== 0
  const remainingQuantity = item.remainingQuantity ?? 0

  return {
    clientRequest: (flag & OrderFlags.ClientRequest) !== 0 || flag === 0,
    draft,
    created: (flag & OrderFlags.Created) !== 0,
    sent,
    cancelled,
    confirmed,
    preOpening: (flag & OrderFlags.PreOpening) !== 0,
    failed,
    cancelRequest,
    editRequest,
    canEdit: (
      sent &&
            confirmed &&
            !draft &&
            !cancelled &&
            !cancelRequest &&
            !editRequest &&
            !failed &&
            remainingQuantity > 0
    ) || draft,
    canDelete: (
      sent &&
            confirmed &&
            !draft &&
            !cancelled &&
            !cancelRequest &&
            !failed &&
            remainingQuantity > 0
    ) || draft,
  }
}
