import { currentUser } from "@clerk/nextjs"

const Prage = async () => {
    const user = await currentUser()
  return (
    <div>Prage {user?.firstName} {user?.lastName} </div>
  )
}

export default Prage