
export interface SimpleAction<Payload> {
    type: string;
    payload: Payload;
}

/// hmm I think it's not practical.
export const getSimpleReducerAndActionCreator = <T, SA extends SimpleAction<T> >(initialState: T, actionName: string) => {
    return {
        reducer: (state = initialState, action: SA) => {
            switch (action.type) {
                case actionName:
                    return action.payload
                default:
                    return state
            }
        },
        actionCreator: (payload: T): SA => {
            return {
                type: actionName,
                payload: payload,
            } as SA; // not sure why we need 
        }
    }
}