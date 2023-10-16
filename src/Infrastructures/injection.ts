/* istanbul ignore file */
import { InstanceOption, createContainer } from "instances-container";
import { UseCaseRegister } from "./injection_register/UseCaseRegister";
import { ServiceRegister } from "./injection_register/ServiceRegister";

export const injection = createContainer();

injection.register(ServiceRegister);
injection.register(UseCaseRegister as InstanceOption[]);
