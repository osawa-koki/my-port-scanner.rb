import type React from 'react'
import { createContext } from 'react'
import type SharedData from './SharedData'
const initData: {
  sharedData: SharedData
  setSharedData: React.Dispatch<React.SetStateAction<SharedData>>
} = {
  sharedData: {
    username: '',
    email: ''
  },
  setSharedData: () => {}
}
export const DataContext = createContext(initData)
