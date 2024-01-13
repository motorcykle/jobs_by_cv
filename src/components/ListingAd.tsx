import Link from "next/link"

export default function ListingAd ({
  listing
}: {
  listing: { title: string, coLocation: string, link: string }
}) {
  return <Link prefetch={false} href={listing?.link}><div className="border p-5 hover:bg-primary-foreground">
    <h3 className="text-xl">{listing?.title}</h3>
    <p className=" text-muted-foreground">{listing?.coLocation}</p>
  </div></Link>
}