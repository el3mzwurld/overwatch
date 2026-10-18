import { Box, Stack, Button } from "@mui/material";
import { motion } from "motion/react";

export const MotionBox = motion.create(Box, { forwardMotionProps: true });
export const MotionStack = motion.create(Stack, { forwardMotionProps: true });
export const MotionButton = motion.create(Button, { forwardMotionProps: true });
