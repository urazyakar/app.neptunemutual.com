import CloseIcon from '@/icons/CloseIcon'
import { classNames } from '@/utils/classnames'
import { useState } from 'react'
import { Trans } from '@lingui/macro'

export const TagsInput = ({ selectedTags, className }) => {
  const [tags, setTags] = useState([])

  const addTags = (e) => {
    if (e.key === ',' && e.target.value !== '') {
      setTags([...tags, e.target.value.replace(',', '')])
      selectedTags([...tags, e.target.value])
      e.target.value = ''
    }
  }

  const removeTags = (index) => {
    setTags([...tags.filter((tag) => tags.indexOf(tag) !== index)])
  }

  return (
    <div
      className={classNames(
        'bg-white flex flex-wrap border border-B0C4DB rounded-lg',
        className
      )}
      data-testid='tags-input-container'
    >
      <ul className='flex flex-wrap mt-2'>
        {tags.map((tag, index) => (
          <li
            key={index}
            className='flex items-center justify-center w-auto px-2 py-2 mx-2 mt-2 rounded-md bg-AABDCB'
            data-testid='tag-item'
          >
            <span>{tag}</span>
            <span className='ml-2 bg-white rounded-lg cursor-pointer'>
              <CloseIcon
                onClick={() => removeTags(index)}
                width={16}
                height={16}
                data-testid='tag-remove-btn'
              >
                <Trans>close</Trans>
              </CloseIcon>
            </span>
          </li>
        ))}
      </ul>
      <input
        placeholder='Tags'
        onKeyUp={(e) => addTags(e)}
        className={classNames(
          'text-h4 block w-full p-6 rounded-lg placeholder-9B9B9B focus:outline-none focus-visible:none focus-visible:ring-4e7dd9'
        )}
        data-testid='input'
      />
    </div>
  )
}
