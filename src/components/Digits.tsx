interface DigitsProps {
    digits: string;
    className?: string
}

function Digits ( { digits, className }: DigitsProps ) {
    return (
        <div className={className}>
            {Number(digits) < 10 ? `0${digits}` : digits}
        </div>
    )
}

export default Digits