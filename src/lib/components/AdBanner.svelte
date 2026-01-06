<script>
  export let width = 728;
  export let height = 90;
  
  // Point to the SvelteKit server route
  export let src = '/ads/banner-728x90';
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
