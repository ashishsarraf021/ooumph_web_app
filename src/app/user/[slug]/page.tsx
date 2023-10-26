import UserProfile from "@/app/components/userProfile/userProfile";


export default function Page({ params }:any) {
  // TODO: Render your static page here.
  return  <UserProfile {...params}/>
}

// This will dynamically generate a page

export async function generateStaticParams() {
  return [];
}