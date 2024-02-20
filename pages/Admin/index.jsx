import {useRouter} from 'next/router';

const Index = () => {
    const router = useRouter();
    router.push('/Admin/Dashboard');
    
    return (<></>);
}

export default Index;