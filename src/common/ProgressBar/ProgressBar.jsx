import { classNames } from '@/utils/classnames'

export const ProgressBar = ({
  value,
  fgClass = 'bg-21AD8C',
  bgClass = 'bg-CEEBED'
}) => {
  return (
    <div
      className={classNames(
        'w-full my-2 rounded-full',
        bgClass || fgClass + ' ' + 'bg-opacity-10'
      )}
    >
      <div
        className={classNames('max-w-full py-1 rounded-full min-w-5', fgClass)}
        style={{ width: `${value * 100}%` }}
      />
    </div>
  )
}
