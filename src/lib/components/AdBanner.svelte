<script>
  import { base } from '$app/paths';
  export let width = 728;
  export let height = 90;
  
  // Ensure the path is always absolute from the root
  const absoluteSrc = `${base || ''}/content-frame.html`.replace(/\/+/g, '/');
  export let src = absoluteSrc;
</script>

<div class="flex justify-center items-center my-4 w-full overflow-hidden">
  <iframe
    src={src}
    {width}
    {height}
    title="Content"
    frameborder="0"
    scrolling="no"
    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
    style="border: none; max-width: 100%;"
  ></iframe>
</div>
