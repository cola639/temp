 formatter: (d) =>
      d.data === 0
        ? ""
        : d.data >= 1000
          ? (d.data / 1000).toFixed(1) + "K"
          : d.data
