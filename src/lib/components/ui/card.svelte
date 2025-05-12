<script>
  import { cn } from "$lib/utils.js";
  
  let className = "";
  export { className as class };
</script>

<div class={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}>
  <slot />
</div>

<script context="module">
  export const CardHeader = ({
    class: className = "",
    ...props
  }) => {
    return (
      <div
        class={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
      />
    );
  };

  export const CardTitle = ({
    class: className = "",
    ...props
  }) => {
    return (
      <h3
        class={cn(
          "text-2xl font-semibold leading-none tracking-tight",
          className
        )}
        {...props}
      />
    );
  };

  export const CardDescription = ({
    class: className = "",
    ...props
  }) => {
    return (
      <p
        class={cn("text-sm text-muted-foreground", className)}
        {...props}
      />
    );
  };

  export const CardContent = ({
    class: className = "",
    ...props
  }) => {
    return (
      <div class={cn("p-6 pt-0", className)} {...props} />
    );
  };

  export const CardFooter = ({
    class: className = "",
    ...props
  }) => {
    return (
      <div
        class={cn("flex items-center p-6 pt-0", className)}
        {...props}
      />
    );
  };
</script>