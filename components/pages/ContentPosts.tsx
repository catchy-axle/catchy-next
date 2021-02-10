import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useQuerySubscription, renderMetaTags } from 'react-datocms'

import { Subscription } from '../../gql/dato-cms'
import { AllContentPosts } from '../../gql/types/AllContentPosts'
import { PreviewBanner } from '../../components/cms/PreviewBanner'
import { PageError } from '../../components/cms/PageError'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { MediumLinks } from '../../components/content-links/MediumLinks'

export const ContentPosts: NextPage<{
  subscription: Subscription<AllContentPosts>
}> = ({ subscription }) => {
  const router = useRouter()
  const { data, error, status } = useQuerySubscription<AllContentPosts>(
    subscription,
  )

  const links =
    data?.allContentPosts.map((post) => ({
      id: post.id,
      url: `/blog/${post.slug}`,
      title: post.seo?.title || null,
      description: post.seo?.description || null,
      image: (post.seo?.image?.responsiveImage as any) || null,
      callToAction: 'Read More',
    })) || []

  return (
    <>
      <Head>
        {renderMetaTags([
          ...(data?.primaryPage?._seoMetaTags || []),
          ...(data?.site.faviconMetaTags || []),
        ])}
      </Head>
      <PreviewBanner status={status} />
      {error && <PageError error={error} />}
      {data?.header && <Header header={data?.header} />}
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-2">
              <h5 className="title is-5">Categories</h5>
              <hr />
              {data?.allCategories.map((cat) => (
                <div key={cat.id} className="mb-2">
                  {cat.slug === router.query.slug ? (
                    <div className="tags are-medium has-addons">
                      <span className="tag is-primary">{cat.name}</span>
                      <a href="/blog" className="tag is-primary is-delete"></a>
                    </div>
                  ) : (
                    <a
                      className="tag is-medium"
                      href={`/blog/category/${cat.slug}`}
                    >
                      {cat.name}
                    </a>
                  )}
                </div>
              ))}
            </div>
            <div className="column is-10">
              <MediumLinks links={links} />
              {links.length === 0 && (
                <div className="section is-size-1 is-italic has-text-centered">
                  No posts to show
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {data?.footer && <Footer footer={data?.footer} />}
    </>
  )
}
