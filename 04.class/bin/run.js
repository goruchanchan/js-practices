#!/usr/bin/env node
import minimist from "minimist";
import Input from "../lib/input.js";
import Controller from "../lib/contoller.js";

const input = new Input(minimist(process.argv.slice(2)));
new Controller(input).selectCommand();
