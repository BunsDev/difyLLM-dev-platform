'use client'
import React, { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import useStickyScroll, { ScrollPosition } from '../use-sticky-scroll'
import Item from './item'
import type { Plugin } from '@/app/components/plugins/types.ts'
import cn from '@/utils/classnames'
import Link from 'next/link'
import { marketplaceUrlPrefix } from '@/config'
import { RiArrowRightUpLine, RiSearchLine } from '@remixicon/react'
// import { RiArrowRightUpLine } from '@remixicon/react'

type Props = {
  wrapElemRef: React.RefObject<HTMLElement>
  list: Plugin[]
  searchText: string
}

const List = ({
  wrapElemRef,
  searchText,
  list,
}: Props, ref: any) => {
  const { t } = useTranslation()
  const hasSearchText = !searchText
  const urlWithSearchText = `${marketplaceUrlPrefix}/plugins?q=${searchText}`
  const nextToStickyELemRef = useRef<HTMLDivElement>(null)

  const { handleScroll, scrollPosition } = useStickyScroll({
    wrapElemRef,
    nextToStickyELemRef,
  })

  const stickyClassName = useMemo(() => {
    switch (scrollPosition) {
      case ScrollPosition.aboveTheWrap:
        return 'top-0 h-9 pt-3 pb-2 shadow-xs bg-components-panel-bg-blur cursor-pointer'
      case ScrollPosition.showing:
        return 'bottom-0 pt-3 pb-1'
      case ScrollPosition.belowTheWrap:
        return 'bottom-0 items-center rounded-b-xl border-t border-[0.5px] border-components-panel-border bg-components-panel-bg-blur shadow-lg cursor-pointer'
    }
  }, [scrollPosition])

  useImperativeHandle(ref, () => ({
    handleScroll,
  }))

  const handleHeadClick = () => {
    if (scrollPosition === ScrollPosition.belowTheWrap) {
      nextToStickyELemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    window.open(urlWithSearchText, '_blank')
  }

  if (!hasSearchText) {
    return (
      <Link
        className='sticky bottom-0 z-10 flex h-8 px-4 py-1 system-sm-medium items-center rounded-b-xl border-t border-[0.5px] border-components-panel-border bg-components-panel-bg-blur  shadow-lg text-text-accent-light-mode-only cursor-pointer'
        href={`${marketplaceUrlPrefix}/plugins`}
        target='_blank'
      >
        <span>{t('plugin.findMoreInMarketplace')}</span>
        <RiArrowRightUpLine className='ml-0.5 w-3 h-3' />
      </Link>
    )
  }

  return (
    <>
      <div
        className={cn('sticky z-10 flex justify-between h-8 px-4 py-1 text-text-primary system-sm-medium cursor-pointer', stickyClassName)}
        onClick={handleHeadClick}
      >
        <span>{t('plugin.fromMarketplace')}</span>
        <Link
          href={urlWithSearchText}
          target='_blank'
          className='flex items-center text-text-accent-light-mode-only'
          onClick={e => e.stopPropagation()}
        >
          <span>{t('plugin.searchInMarketplace')}</span>
          <RiArrowRightUpLine className='ml-0.5 w-3 h-3' />
        </Link>
      </div>
      <div className='p-1' ref={nextToStickyELemRef}>
        {list.map((item, index) => (
          <Item
            key={index}
            payload={item}
            onAction={() => { }}
          />
        ))}
        <div className='mt-2 mb-3 flex items-center space-x-2'>
          <div className="w-[90px] h-[2px] bg-gradient-to-l from-[rgba(16,24,40,0.08)] to-[rgba(255,255,255,0.01)]"></div>
          <Link
            href={urlWithSearchText}
            target='_blank'
            className='shrink-0 flex items-center h-4 system-sm-medium text-text-accent-light-mode-only'
          >
            <RiSearchLine className='mr-0.5 w-3 h-3' />
            <span>{t('plugin.searchInMarketplace')}</span>
          </Link>
          <div className="w-[90px] h-[2px] bg-gradient-to-l from-[rgba(255,255,255,0.01)] to-[rgba(16,24,40,0.08)]"></div>
        </div>
      </div>
    </>
  )
}
export default forwardRef(List)