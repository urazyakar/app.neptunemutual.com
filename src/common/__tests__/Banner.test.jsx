const { Banner } = require('@/common/Banner')
const { FAUCET_URL, LEADERBOARD_URL } = require('@/src/config/constants')
const { initiateTest, mockFn } = require('@/utils/unit-tests/test-mockup-fn')
const { screen, fireEvent } = require('@testing-library/react')

describe('Banner test', () => {
  const { initialRender, rerenderFn } = initiateTest(Banner, {}, () => {
    mockFn.useNetwork()
  })

  beforeEach(() => {
    initialRender()
  })

  test('should render the banner container if networkId is valid', () => {
    const wrapper = screen.queryByTestId('banner-container')
    expect(wrapper).toBeInTheDocument()
  })

  test('should not render the banner container if no network', () => {
    rerenderFn({}, () => {
      mockFn.useNetwork(() => ({ networkId: null }))
    })

    const wrapper = screen.queryByTestId('banner-container')
    expect(wrapper).toBeNull()
  })

  test('should have `Test Tokens` & `View Leaderboard` label in the Banner', () => {
    const label1 = screen.queryByText('Test Tokens')
    const label2 = screen.queryByText('View Leaderboard')
    expect(label1).toBeInTheDocument()
    expect(label2).toBeInTheDocument()
  })

  test('should have correct hrefs for `Test Tokens` & `View Leaderboard`', () => {
    const link1 = screen.getByTestId('faucet-link')
    const link2 = screen.getByTestId('leaderboard-link')
    expect(link1).toHaveAttribute('href', FAUCET_URL)
    expect(link2).toHaveAttribute('href', LEADERBOARD_URL)
  })

  test('should render the banner close button', () => {
    const button = screen.getByTestId('close-banner')
    expect(button).toBeInTheDocument()
  })

  test('should not show the banner after the close button is clicked', () => {
    const button = screen.getByTestId('close-banner')
    fireEvent.click(button)
    const wrapper = screen.queryByTestId('banner-container')
    expect(wrapper).toBeNull()
  })
})
