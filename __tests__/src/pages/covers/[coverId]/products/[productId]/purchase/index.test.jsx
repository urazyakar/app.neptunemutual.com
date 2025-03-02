import { initiateTest, mockFn } from '@/utils/unit-tests/test-mockup-fn'
import { screen } from '@testing-library/react'

jest.mock('@/src/modules/cover/purchase', () => ({
  CoverPurchaseDetailsPage: () => (
    <div data-testid='cover-purchase-details-page' />
  )
}))

describe('CoverPurchaseDetails test', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    mockFn.useRouter()
    process.env = { ...OLD_ENV, NEXT_PUBLIC_ENABLE_V2: 'true' }
    const CoverPurchaseDetails =
      require('@/src/pages/covers/[coverId]/products/[productId]/purchase').default
    const { initialRender } = initiateTest(CoverPurchaseDetails)
    initialRender()
  })

  test('Should display Cover Purchase Details component', () => {
    const newIncidentReportPage = screen.getByTestId(
      'cover-purchase-details-page'
    )
    expect(newIncidentReportPage).toBeInTheDocument()
  })
})
