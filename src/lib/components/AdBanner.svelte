<script>
  import { base } from '$app/paths';
  export let width = 728;
  export let height = 90;
  export let src = `${base}/content-frame.html`;
</script>

<div class="flex justify-center items-center my-4 w-full overflow-hidden">
  <iframe
    {src}
    {width}
    {height}
    title="Content"
    frameborder="0"
    scrolling="no"
    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
    style="border: none; max-width: 100%;"
  ></iframe>
</div>
