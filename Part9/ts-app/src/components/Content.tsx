import type { CoursePart } from '../types'
import Part from "./Part"

interface ContentProps {
    parts: CoursePart[];
}

const Content = (props: ContentProps) => {
    return (
        <div>
            { props.parts.map((part) => (
                <Part part={part} />
            ))}
        </div>
    )
}

export default Content