import Link from "next/link";

interface FooterProps {
    currentPageNumber: number;
    nextPage: string;
    previousPage: string;
}

const Footer = (props: FooterProps) => {
    return <div className='w-full sticky bottom-0 bg-black text-white'>
        <div className="flex justify-between">
            <Link href={props.previousPage}>⬅️</Link>
            <Link href='/'>🏠</Link>
            <Link href={props.nextPage}>➡️</Link>
        </div>
    </div>
}

export default Footer;