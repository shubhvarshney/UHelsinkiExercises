interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartVerbose extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartVerbose {
  kind: "basic";
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
}

interface CoursePartBackground extends CoursePartVerbose {
  backgroundMaterial: string;
  kind: "background";
}

interface CoursePartRequirements extends CoursePartVerbose {
  requirements: string[];
  kind: "requirements";
}

export type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartRequirements;