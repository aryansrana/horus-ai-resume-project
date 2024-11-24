// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock the useRouter hook
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
    }
  },
}))

// Mock the Cookies library
jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}))

// Mock the jwt-decode library
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}))

// Suppress console.error in tests
console.error = jest.fn()

