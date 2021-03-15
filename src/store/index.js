// import { createStoreRoot, createStore, createModelHook } from '@zjxpcyc/react-tiny-store'
import { createStoreRoot, createStore, createModelHook } from '../utils/store'
import models from './models'

export const store = createStore()
export const StoreRoot = createStoreRoot(store, models)
export const useModel = createModelHook(store)
