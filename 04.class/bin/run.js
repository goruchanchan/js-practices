#!/usr/bin/env node
import Input from "../lib/input.js";
import Controller from "../lib/controller.js";

new Controller(new Input()).selectCommand();
