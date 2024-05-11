'use client'

interface HeadingProps {
    title: string;
    subtitle?: string;
    center?: boolean;
}

const Heading = ({
    title,
    subtitle,
    center
} : HeadingProps) => {
    
    return ( 
        <div className={center ? 'text-center' : 'text-start'}>
            <div className='text-2xl text-black dark:text-white font-bold'>
                {title}
            </div>
            <div className='font-light text-black dark:text-white mt-2'>
                {subtitle}
            </div>
        </div>
     );
}
 
export default Heading;