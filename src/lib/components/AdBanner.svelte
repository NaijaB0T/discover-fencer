<script>
  export let width = 728;
  export let height = 90;
  // Using a root-relative path to the new filename
  export let src = '/ad-728x90.html?v=2';
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
