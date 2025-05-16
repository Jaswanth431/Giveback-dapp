import { createStore } from 'redux';

const initialState = {
  provider: null,
  signer: null,
  address: null,
  user: null,
  isWalletConnected: false
};

const SET_WALLET = 'SET_WALLET';
const RESET_WALLET = 'RESET_WALLET';
const SET_USER = 'SET_USER';
const RESET_USER = 'RESET_USER';
const SET_WALLET_CONNECTED = 'SET_WALLET_CONNECTED';

export const setWallet = (wallet) => ({
  type: SET_WALLET,
  payload: wallet,
});

export const resetWallet = () => ({
  type: RESET_WALLET,
});

export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

export const resetUser = () => ({
  type: RESET_USER,
});

export const setWalletConnected = (isConnected) => ({
  type: SET_WALLET_CONNECTED,
  payload: isConnected,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_WALLET:
      return {
        ...state,
        provider: action.payload.provider,
        signer: action.payload.signer,
        address: action.payload.address,
      };
    case RESET_WALLET:
      return {
        ...state,
        provider: null,
        signer: null,
        address: null,
        isWalletConnected: false
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload
      };
    case RESET_USER:
      return {
        ...state,
        user: null
      };
    case SET_WALLET_CONNECTED:
      return {
        ...state,
        isWalletConnected: action.payload
      };
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
