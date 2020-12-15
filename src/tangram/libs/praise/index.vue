<template>
  <div class="vhall-praise">
    <div>
      <span class="support-heart" @click="support"></span>
      <span>{{ timeShowAccount }}</span>
    </div>
    <div>
      <div class="hello"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    roomId: {
      type: String
    },
    times: {
      type: Number
    }
  },
  data () {
    return {
      timeShowAccount: 0, // 页面上显示的点赞次数
      timesPage: 0,
      timess: 0,
      praiseImg: false,
      clearSet: null,
      imgList: [
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAARCAYAAAA/mJfHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA25pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmMmQxYjg4My0wNDc0LWZhNDYtOWY4Yi0zMjBiZDM1MTYzNTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUE4MzA2M0Q2MERDMTFFNTgyNjY5ODNENDU5REZEMTQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUE4MzA2M0M2MERDMTFFNTgyNjY5ODNENDU5REZEMTQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RDMzNDdGMUY2MERDMTFFNTg3M0NEQUZCNDdDQzU3NEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RDMzNDdGMjA2MERDMTFFNTg3M0NEQUZCNDdDQzU3NEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz75WTbuAAABkUlEQVR42mL8//8/A7UAEwMVAQsy5+bNm8JAqgGIA4FYBIivA/EkIF4AxAlAnAvEWkD8BojXg9Sqq6u/helnhHkTaBBI89H7F36rPb3+m+H3z/8MPEJMDDIarAySaizXnt/6o/Xkxm+GL+/+MbCyMzJIa7IyKBqw3gLqsQYa+AbdZY33z/9Wu3fuF1zg0+t/DNde/2R4ePm31tcP/+DiP7/9Z7h3FqjuP4OaoiFrI1AoGz3MAp8CbcYGkA1CBk+ug9UHYYsAIZDXSAF/foHVC2Iz7KKAODNJhkHVX8JmWJe0Jgs4cIlKBuBIAAd5J4ZhwBhZK6bA0qJkzErQQJC8MlAdUH0bSB/WdAaUqAUmEhCz5v653wy/fmCGIRsHI4OiESuDjCZrC0Q9jkSLZCAo+uqASYXh13eEgWycQIMMwQY1AdXV480BSAYCFd78C0p7Dy78Bqcrdi5GBgUDsEH1QPkmgtkJzcAmqAubH1/9wyCrzQIyqAYo3oozMEHZCR++ceNGPhC/B9GE1DIO2iIIIMAA3NG+BaHS6lcAAAAASUVORK5CYII=',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAARCAYAAAA/mJfHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA25pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmMmQxYjg4My0wNDc0LWZhNDYtOWY4Yi0zMjBiZDM1MTYzNTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MEMwNEYwMjc2MEREMTFFNUEwQjZGMkYwNjc4MjM2MTYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MEMwNEYwMjY2MEREMTFFNUEwQjZGMkYwNjc4MjM2MTYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RDMzNDdGMUY2MERDMTFFNTg3M0NEQUZCNDdDQzU3NEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RDMzNDdGMjA2MERDMTFFNTg3M0NEQUZCNDdDQzU3NEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz67gtTiAAABgElEQVR42syUz0oCURTGzwyaOU1QGbXIWpgoCEHRyqyHsCdoXUQvYJp/CmoZ1LoXiF4iaxVaQWmUi6xNKC26jpqmfUeKpBlToaADH5c79zs/7pw5Z6R6vU6/FdKfwdLptA3LBuSHhqFraBc6gJagVcgD5aAj9rrd7rwOBhAnx9XTjMuayJJcrFB1pJ+0aTsVp8aurJePHiX5QKanF6pZzVScGSfhddwgxwdg7jtsTz3JLKvHt7rrV20qmfJC91zMO0nMOfYBW+G93HTmV5JZw1oYgTiURMO/+Llvhg1JeLWuCl5q+AeNYOcV+0BXsA//hRFsR0NRubidRK3XTOxHbOtgKOJhyTUa46K2A/K5WHAS/Fuc17Jp8VWjKGxAjd+RrL3qQUoPCd8k3yoG0HrbCQAwDGAQrUJyofwF6rNwKzAoAlCo43ECMAhgGE1MsijTm2qhgrcBCgEU6Xo2AQwAGFXO7kmbnWBQAKDNlgkM+0mpVGoNeua1nVf6t7+gdwEGAIC/3lEuhtxzAAAAAElFTkSuQmCC',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAARCAYAAAA/mJfHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmMmQxYjg4My0wNDc0LWZhNDYtOWY4Yi0zMjBiZDM1MTYzNTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDMzNDdGMjA2MERDMTFFNTg3M0NEQUZCNDdDQzU3NEUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDMzNDdGMUY2MERDMTFFNTg3M0NEQUZCNDdDQzU3NEUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NmY3MDVjYjYtYjlmYi00MTQ0LTk4MzgtODEwNDNlNjczNDk0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOmYyZDFiODgzLTA0NzQtZmE0Ni05ZjhiLTMyMGJkMzUxNjM1NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PiMMAUgAAAGBSURBVHjaYvz//z8DtQATAxUBCzLn5s2bwkCqAYgDgVgEiK8D8SQgXgDECUCcC8RaQPwGiNeD1Kqrq7+F6WeEeRNoEEjzUcHr59T47l1nYP75g+EXvxDDR2Uths8K6td4H9zU4r97jYHt4zuGv+wcDJ+UNBneaxrdAuqxBhr4Bt2wqUCDsoSunsFw/i8+QQa2T+8xxN9pm4AMnAY0LBs9zAJBNmMD2AwCAaj6IGwRIMT06ydpsQdRL4jNsIs/RCRIMgyq/hI2w7pAgf2XjYMog/6xsYMjBwg6MQwDBuLar9KKLaBAJWQgSP6ttikDUH0bSB/WdAaUqL0JYdYIXTsDTh4YBgGTxTstE4ZPylotIPU4Ey2Sgf+AzDqh6+cYmH98QxjEwcXwTtMIZFATUF093hyAZGA90MC/QGaj4I1zDCzfvzH84eRmeK9hCDKoHijfRDA7oRnYBHVhs8CdKwwfVHRABtUAxVtxBiYoB+DDN27cyAfi9yCakFrGQVsEAQQYALVHwFkVlT5VAAAAAElFTkSuQmCC',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAARCAYAAAA/mJfHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA25pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmMmQxYjg4My0wNDc0LWZhNDYtOWY4Yi0zMjBiZDM1MTYzNTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDM2OEFFMTA2MEREMTFFNThCQUFBRERDNTgwNzVGMjQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDM2OEFFMEY2MEREMTFFNThCQUFBRERDNTgwNzVGMjQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RDMzNDdGMUY2MERDMTFFNTg3M0NEQUZCNDdDQzU3NEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RDMzNDdGMjA2MERDMTFFNTg3M0NEQUZCNDdDQzU3NEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4ZGBXeAAABiElEQVR42mL8//8/A7UAEwMVAQsy5+bNm8JAqgGIA4FYBIivA/EkIF4AxAlAnAvEWkD8BojXg9Sqq6u/helnhHkTaBBI81GuV4fVON6eZWD8843hL6c4ww9hY4YfggbXON5f0AKJM39/yfCfhQss/k3M9hZQjzXQwDfoLmvkenlYjevlAYSzvz1j4AFiztcntJh/vIaLM/7+zMD1AqjuP4PaN3HbRqBQNnqYBXK8O4M1LJANQgYcb8Hqg7BFgBDjn+8kBTjjX7B6QWyGXfzDLUeSYVD1l7AZ1gUK1P/MnEQZ9J+ZAxwJQNCJYRgwRtb+5Nds+SrhSNBAkPxXCScGoPo2kD6s6QwoUXvzJphZA4pVJmDyQAf/gMnim7gDyFUtIPV4cwBIAVBhE0jDPxYeNIN4YAY1oRuE4TIkA+uBLvwLTnuvDjMwAdPVP1ZeUCIFGVQPlG8imJ3QDGwCGvgPyGzmfHOS4buIOcigGqB4K+7ABGYnfPjGjRv5QPweRBNSyzhoiyCAAAMAwrHCpDziS/YAAAAASUVORK5CYII=',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAARCAYAAAA/mJfHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA25pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmMmQxYjg4My0wNDc0LWZhNDYtOWY4Yi0zMjBiZDM1MTYzNTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjM1REZGRUY2MERDMTFFNTg5MjZEQjkyNzZFNTNCQzEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjM1REZGRUU2MERDMTFFNTg5MjZEQjkyNzZFNTNCQzEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RDMzNDdGMUY2MERDMTFFNTg3M0NEQUZCNDdDQzU3NEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RDMzNDdGMjA2MERDMTFFNTg3M0NEQUZCNDdDQzU3NEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Cs1a+AAABgElEQVR42mL8//8/A7UAEwMVAQsy5+bNm8JAqgGIA4FYBIivA/EkIF4AxAlAnAvEWkD8BojXg9Sqq6u/helnhHkTaBBI89E1n/6q7fz6l+Hzv/8M8qyMDO7czAxO3MzX9n39qwUSf/j7PwMvE0Q8hI/5FlCPNdDAN+gua1wNNGjFpz9wgTu//gPxH4aNX/5qPfmNCNt3f/8zLAeqA4qohfIxNwKFstHDLBBkMzaAbBAy2AFRH4QtAoS+/CMtZr9C1AtiM+yiBhtpkQtVfwmbYV0ePMzgwCUG8AB1gtQDQSeGYcAYWWvBydQSyUfYQJB8FB8LA1B9G0gf1nQGlKgFphEQs2bFp78Mn7CEIR/QoAighe48zC1g9bgSLZKB/4DMulWf/zJ8+IswUICZkSGMF2xQE1BdPd4cgGRgPdBAULw3rgEaCEpXQkCDQiAG1QPlmwhmJzQDm6AubN7y5S+DDw/YoBqgeCvOwARlJ3z4xo0b+UD8HkQTUss4aIsggAADAGJWwboAPeA7AAAAAElFTkSuQmCC',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAARCAYAAAA/mJfHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA25pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmMmQxYjg4My0wNDc0LWZhNDYtOWY4Yi0zMjBiZDM1MTYzNTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkI2MjZDOUM2MERDMTFFNTg5QzFDMzI4QUU3OTFGQkQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkI2MjZDOUI2MERDMTFFNTg5QzFDMzI4QUU3OTFGQkQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RDMzNDdGMUY2MERDMTFFNTg3M0NEQUZCNDdDQzU3NEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RDMzNDdGMjA2MERDMTFFNTg3M0NEQUZCNDdDQzU3NEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gbhd0AAABiklEQVR42mL8//8/A7UAEwMVAQsy5+bNm8JAqgGIA4FYBIivA/EkIF4AxAlAnAvEWkD8BojXg9Sqq6u/helnhHkTaBBI89Gdn46rHfl6nuHrv+8MUqxiDDbcBgwW3LrXTny9rHXk6wWGZ79fMXAzcQLFDRnc+SxvAfVYAw18g27Y1B2fjmVt+3QEw/kSrMIML36/xRD34rNh8OCzmgY0LBs9zAJBNmMD2AwCAZAPgCAIWwQIfQN6jRTw7d8PECWIzbCLSmwyJBkGVX8Jm2FdNjyG4MAlBnAxcTCA1ANBJ4ZhwEBca8Cp1uINDFRCBoLkffhsGYDq20D6sKYzoEQtw00ws2bbp6MMX/59wzCIh4kLGIvWIFe1gNXjSrRIBv4DMut2fD7G8OnvV7gcHzM3gwevFcigJqC6erw5AMnAeqCBf4HMxp2fjzN8/PuFgZ+Zh8Gd1xJkUD1QvolgdkIzsAnqwuYDX84yOPAYgwyqAYq34gxMUA7Ah2/cuJEPxO9BNCG1jIO2CAIIMABz2Ldy/uQYQAAAAABJRU5ErkJggg=='
      ]
    };
  },
  created () {
    // this.praise();
    this.timesPage = JSON.parse(sessionStorage.getItem('moduleShow')).webinar.like + this.times;
    this.timeShowAccount = this.transformWatchNum(this.timesPage);
  },
  mounted () {},

  methods: {
    startZanAnimation () {
      /* global $ */
      let imgIndex = parseInt(Math.random() * 5);
      console.log(imgIndex, '2132132131');
      var random = this.getRandom(10) * 3;
      var img = new Image();
      img.src = `${this.imgList[imgIndex]}`
      img.style.cssText = `z-index:666;position:absolute;bottom:0;left:${random}px`;
      // var img = $(
      //   `<img style="z-index:666;position:absolute;bottom:0;left:${random}px" src=${this.imgList[imgIndex]}>`
      // );
      let helloDom = document.querySelector('.hello')
      let supportDom = document.querySelector('.support-heart')
      helloDom.style.left = supportDom.style.left + 'px'
      helloDom.append(img)
      // $('.hello')
      //   .css('left', $('.support-heart').position().left + 'px')
      //   .append(img);
      img.animate(
        {
          bottom: '90px',
          opacity: '0.7',
          left: random + Number(parseInt(Math.random() * 20)) + 'px'
        },
        500,
        'linear',
        function () {
          img.animate(
            {
              bottom: '180px',
              opacity: '0.4',
              left: random + Number(parseInt(Math.random() * 50)) + 'px'
            },
            1000,
            'linear',
            function () {
              img.animate(
                {
                  bottom: '270px',
                  opacity: '0.1',
                  left: random + Number(parseInt(Math.random() * 100)) + 'px'
                },
                1500,
                'linear',
                function () {
                  img.remove();
                }
              );
            }
          );
        }
      );
    },
    getRandom (max, flag) {
      var num;
      if (flag) {
        if (Math.random() > 0.5) {
          num = true;
        } else {
          num = false;
        }
      }
      return num
        ? '-' + Math.floor(Math.random() * (max + 1))
        : Math.floor(Math.random() * (max + 1));
    },
    support () {
      this.startZanAnimation();
      // startZanAnimation();

      if (this.clearSet) {
        window.clearTimeout(this.clearSet);
      } else {
        this.clearSet = null;
      }
      this.timess++;
      this.timesPage = this.timesPage + 1;
      this.timeShowAccount = this.transformWatchNum(this.timesPage);
      this.getRandom(5);
      this.imgList.push(require(`./img/zan-${this.getRandom(5)}.png`));
      this.clearSet = setTimeout(() => {
        this.praise();
        this.timess = 0;
      }, 2000);
    },
    transformWatchNum (num) {
      if (num < 10000) {
        // this.timesPage = num
        return num;
      } else {
        let n = Math.floor(num / 10000);
        return n + 'w';
      }
    },
    praise () {
      window.vhallReport.report('PRAISE');
      // TODO:
      this.$fetch('like', {
        room_id: this.roomId,
        num: this.timess
      }).then(res => {
        if (res.code === 200) {
          console.log(res);
        }
      });
    }
  }
};
</script>
<style lang="less">
.vhall-praise {
  width: 60px;
  position: relative;
  user-select: none;

  div {
    span {
      display: inline-block;
      vertical-align: middle;
    }
    span:last-of-type {
      width: 24px;
    }

    .support-heart {
      margin-bottom: 2px;
      width: 32px;
      height: 32px;
      cursor: pointer;
      z-index: 666;
      background: url(../../assets/images/publish/like-3.1.4.png);
    }

    .support-heart:hover {
      background: url(../../assets/images/publish/like-hover-3.1.4.png);
    }
  }

  .hello {
    width: 30px;
    height: 1px;
    top: 2px;
    position: absolute;
    left: -100px;
    .box {
      position: absolute;
      height: 300px;
      width: 300px;
    }
  }
}
</style>
