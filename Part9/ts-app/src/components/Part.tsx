import type { CoursePart } from '../types'

interface PartProps {
    part: CoursePart;
}

const assertNever = (value: never): never => {
    throw new Error (
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
};

const Part = (props: PartProps) => {
    switch (props.part.kind) {
        case "basic":
            return (
                <p>
                    <b>{props.part.name} {props.part.exerciseCount}</b>
                    <br/>
                    <em>{props.part.description}</em>
                </p>
            );
        case "group":
            return (
                <p>
                    <b>{props.part.name} {props.part.exerciseCount}</b>
                    <br/>
                    project exercises {props.part.groupProjectCount}
                </p>
            );
        case "background":
            return (
                <p>
                    <b>{props.part.name} {props.part.exerciseCount}</b>
                    <br/>
                    <em>{props.part.description}</em>
                    <br/>
                    submit to {props.part.backgroundMaterial}
                </p>
            );
        case "requirements":
            return (
                <p>
                    <b>{props.part.name} {props.part.exerciseCount}</b>
                    <br/>
                    <em>{props.part.description}</em>
                    <br/>
                    required skills: {props.part.requirements.join(", ")}
                </p>
            );
        default:
            return assertNever(props.part);
    }
}

export default Part;