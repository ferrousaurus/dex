import { createFormHook } from "@tanstack/react-form-start";
import formHookContexts from "../../contexts/formHook.ts";

// Allow us to bind components to the form to keep type safety but reduce production boilerplate
// Define this once to have a generator of consistent form instances throughout your app
const formHook = createFormHook({
  fieldComponents: {},
  formComponents: {},
  fieldContext: formHookContexts.fieldContext,
  formContext: formHookContexts.formContext,
});

export default formHook;
