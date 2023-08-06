import Link from "next/link";

interface FooterProps {
    currentPageNumber: number;
    nextPage: string;
    previousPage: string;
}

const Footer = (props: FooterProps) => {
    return <div className='w-full sticky bottom-0 bg-black text-white'>
        <div className="flex justify-between items-center h-10 text-2xl">
            {!props.previousPage ? <div className='min-w-[60px]'></div> : <Link href={props.previousPage}  className='min-w-[60px]'>⬅️ {props.currentPageNumber - 1}</Link>}
            <Link href='/'>⏏️</Link>
            {!props.nextPage ? <div  className='min-w-[60px]'></div> : <Link href={props.nextPage}  className='min-w-[60px]'>{props.currentPageNumber + 1} ➡️</Link>}
        </div>
    </div>
}

export default Footer;