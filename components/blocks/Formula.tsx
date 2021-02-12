import { FC } from 'react'
import { Image, ResponsiveImageType } from 'react-datocms'

import { PrimaryPageBySlug_primaryPage_blocks_FormulaRecord } from '../../gql/types/PrimaryPageBySlug'

export const Formula: FC<{
  block: PrimaryPageBySlug_primaryPage_blocks_FormulaRecord
}> = ({ block }) => (
  <div className="columns formula">
    {[block.step1, block.step2, block.step3].map(
      (step, i, steps) =>
        step && (
          <div key={step.id} className="column">
            {i < steps.length - 1 && (
              <img className="arrow" src="https://i.imgur.com/YkHuAqc.png" />
            )}
            {step.responsiveImage && (
              <Image
                lazyLoad={false}
                data={step.responsiveImage as ResponsiveImageType}
              />
            )}
          </div>
        ),
    )}
  </div>
)
