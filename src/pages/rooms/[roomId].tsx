import { useRouter } from "next/router";

export default function Room(){

    const router = useRouter();
    const {roomId} = router.query;

    return <h1>Id sala: {roomId}</h1>
}