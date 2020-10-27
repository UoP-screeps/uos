export const TaskTypeConstant = {
    SAMPLE_TASK: "SAMPLE_TASK",
    TEST_TASK: "TEST_TASK"
} as const;

export type TaskType = keyof typeof TaskTypeConstant;