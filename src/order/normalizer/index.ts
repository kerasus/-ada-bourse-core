import {OrderFlags, OrderType} from "../../types";

export function parseOrderFlags (item: OrderType) {
    const flag = item.flags ?? 0
    const failed = (flag & OrderFlags.FAILED) === OrderFlags.FAILED
    const draft = (flag & OrderFlags.Draft) === OrderFlags.Draft
    const sent = (flag & OrderFlags.Sent) === OrderFlags.Sent
    const confirmed = (flag & OrderFlags.Confirmed) === OrderFlags.Confirmed
    const cancelled = (flag & OrderFlags.Cancelled) === OrderFlags.Cancelled
    const cancelRequest = (flag & OrderFlags.CANCEL_REQUEST) === OrderFlags.CANCEL_REQUEST
    const editRequest = (flag & OrderFlags.EDIT_REQUEST) === OrderFlags.EDIT_REQUEST
    const remainingQuantity = item.remainingQuantity ?? 0

    return {
        clientRequest: (flag & OrderFlags.ClientRequest) === OrderFlags.ClientRequest,
        draft,
        created: (flag & OrderFlags.Created) === OrderFlags.Created,
        sent,
        cancelled,
        confirmed,
        preOpening: (flag & OrderFlags.PreOpening) === OrderFlags.PreOpening,
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
        ) || draft
    }
}
