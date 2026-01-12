"use client";
import React, { useState, useEffect, useRef } from 'react';

const SYMBOLS = "!@#$%^&*()_+";
const INITIAL_VELOCITY = 1;
const ACCELERATION = 0.5;
const LOOKOUT_MULTIPLIER = 1.6;
const MUTATION_CHANCE = 0.2;
const SPACE_TO_SYMBOL_CHANCE = 0.05;

interface ShuffleProps {
    title: string;
    text?: string;
    isExiting?: boolean;
}

const ShuffleTest = (props: ShuffleProps) => {
    return (
        <div>{props.title}</div>
    )
}

export default ShuffleTest;