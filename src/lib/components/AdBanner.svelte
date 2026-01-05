<script>
  import { base } from '$app/paths';
  export let width = 728;
  export let height = 90;
  export let src = `${base}/ad-728x90.html`;
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
