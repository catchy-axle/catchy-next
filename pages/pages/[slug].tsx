import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import {
  useQuerySubscription,
  renderMetaTags,
  ResponsiveImageType,
} from 'react-datocms'
import Head from 'next/head'
import Link from 'next/link'

import {
  createSubscription,
  getContentPagePaths,
  Subscription,
} from '../../util/dato-cms'
import { contentPageBySlug } from '../../gql/queries/content-pages'
import {
  ContentPageBySlug,
  ContentPageBySlug_contentPage_parent,
} from '../../gql/types/ContentPageBySlug'
import { PreviewBanner } from '../../components/cms/PreviewBanner'
import { PageError } from '../../components/cms/PageError'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { BlockSections } from '../../components/BlockSections'
import { CardRows } from '../../components/content-links/CardRows'
import { notEmpty } from '../../util/notEmpty'

const ContentPage: NextPage<{
  subscription: Subscription<ContentPageBySlug>
}> = ({ subscription }) => {
  const { data, error, status } = useQuerySubscription<ContentPageBySlug>(
    subscription,
  )

  const ancestors = extractAncestors(data?.contentPage?.parent || null, [])

  const links =
    data?.contentPage?.children
      ?.map(
        (child) =>
          child && {
            id: child.id,
            url: `/pages/${child.slug || ''}`,
            title: child.title,
            description: child.description,
            image:
              (child.previewImage?.responsiveImage as ResponsiveImageType) ||
              null,
            callToAction: 'Read More',
          },
      )
      .filter(notEmpty) || []

  return (
    <div className="content-page">
      <Head>
        {renderMetaTags([
          ...(data?.contentPage?._seoMetaTags || []),
          ...(data?.site.faviconMetaTags || []),
        ])}
      </Head>
      <PreviewBanner status={status} />
      {error && <PageError error={error} />}
      {data?.header && <Header header={data?.header} />}
      <header className="section">
        <div className="container is-max-desktop">
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li>
                <Link href="/home">
                  <a>Home</a>
                </Link>
              </li>
              {ancestors.map((ancestor) => (
                <li key={ancestor.id}>
                  <Link href={`/pages/${ancestor.slug || ''}`}>
                    <a>{ancestor.title}</a>
                  </Link>
                </li>
              ))}
              <li className="is-active">
                <a aria-current="page">{data?.contentPage?.title}</a>
              </li>
            </ul>
          </nav>
          <h1 className="title is-1">{data?.contentPage?.title}</h1>
        </div>
      </header>
      <BlockSections
        blocks={data?.contentPage?.blocks || []}
        containerMax="desktop"
      />
      {links.length > 0 && (
        <section className="section">
          <div className="container is-max-desktop">
            <CardRows links={links} />
          </div>
        </section>
      )}
      {data?.footer && <Footer footer={data?.footer} />}
    </div>
  )
}

type Parent = ContentPageBySlug_contentPage_parent
const extractAncestors = (parent: Parent | null, list: Parent[]): Parent[] => {
  if (parent === null) return list
  else return extractAncestors(parent.parent as Parent, [...list, parent])
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: await getContentPagePaths(),
  fallback: 'blocking',
})

export const getStaticProps: GetStaticProps = async (context) => {
  const subscription = await createSubscription<ContentPageBySlug>(
    context,
    contentPageBySlug,
    { slug: context?.params?.slug },
  )
  return subscription.initialData?.contentPage
    ? { props: { subscription } }
    : { notFound: true }
}

export default ContentPage
