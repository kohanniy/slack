import { useReducer, useCallback, useRef } from 'react';

const defaultInitialState = {
  status: 'idle',
  data: null,
  error: null
};

const reducer = (state, action) => ({...state, ...action});

const useAsync = (initialState) => {
  const initialStateRef = useRef({
    ...defaultInitialState,
    ...initialState,
  })
  const [{ status, data, error }, setState] = useReducer(reducer, initialStateRef.current);

  const run = useCallback(
    async (promise) => {
      if (!promise) {
        throw new Error(
          `Аргумент, переданный в useAsync().run, должен быть promis'ом. Может, переданная функция ничего не возвращает?`,
        )
      }
      setState({status: 'pending'})
      try {
        const data = await promise;
        setState({status: 'resolved', data})
        // return data;
      } catch(error) {
        setState({status: 'rejected', error})
      }
    }, [],
  )

  const setData = useCallback(data => setState({ data }), []);

  const setError = useCallback(error => setState({ error }), []);

  const reset = useCallback(() => setState(initialStateRef.current), []);

  return {
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isError: status === 'rejected',
    isSuccess: status === 'resolved',

    setData,
    setError,
    error,
    status,
    data,
    run,
    reset,
  }
};

export default useAsync;