<script>
  export let width = 728;
  export let height = 90;
  // Use a root-relative path and ensure it's treated as a static file
  export let src = '/ads/banner-728x90.html?v=1';
</script>

<div class="flex justify-center items-center my-4 w-full overflow-hidden">
  <iframe
    {src}
    {width}
    {height}
    title="Advertisement"
    frameborder="0"
    scrolling="no"
    style="border: none; max-width: 100%;"
  ></iframe>
</div>
