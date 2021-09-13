/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable prefer-const */
/* eslint-disable no-confusing-arrow */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-cycle */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-mixed-operators */
/* eslint-disable arrow-parens */
/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable max-len */
/* eslint-disable object-curly-newline */

import React from "react";
// import Array1DRenderer from '../Array1DRenderer/index';
import { motion, AnimateSharedLayout } from "framer-motion";
import Renderer from "../../common/Renderer/index";
import styles from "./Array2DRenderer.module.scss";
import { classes } from "../../common/util";
import { mode } from "../../../top/Settings";

let modename;
function switchmode(modetype = mode()) {
  switch (modetype) {
    case 1:
      modename = styles.array_2d_green;
      break;
    case 2:
      modename = styles.array_2d_blue;
      break;
    default:
      modename = styles.array_2d;
  }
  return modename;
}

class Array2DRenderer extends Renderer {
  constructor(props) {
    super(props);

    this.togglePan(true);
    this.toggleZoom(true);
  }

  renderData() {
    const { data, algo } = this.props.data;
    const isArray1D = true;
    // const isArray1D = this instanceof Array1DRenderer;
    let longestRow = data.reduce(
      (longestRow, row) => (longestRow.length < row.length ? row : longestRow),
      []
    );

    return (
      <motion.table
      animate={{scale: this.zoom}}
        className={switchmode(mode())}
        style={{
          marginLeft: -this.centerX * 2,
          marginTop: -this.centerY * 2,
          // transform: `scale(${this.zoom})`,
        }}
      >
        <tbody>
          {/* Indexes */}
          <tr className={styles.row}>
            {!isArray1D && <td className={classes(styles.col, styles.index)} />}
            {longestRow.map((_, i) => {
              // if the graph instance is heapsort, then the array index starts from 1
              if (algo === "heapsort") {
                i += 1;
              }
              return (
                <td className={classes(styles.col, styles.index)} key={i}>
                  <span className={styles.value}>{i}</span>
                </td>
              );
            })}
          </tr>
          {/* Values */}
          {data.map((row, i) => (
            <tr className={styles.row} key={i}>
              {!isArray1D && (
                <td className={classes(styles.col, styles.index)}>
                  <span className={styles.value}>{i}</span>
                </td>
              )}
              {row.map((col) => (
                <motion.td
                  layout
                  transition={{ duration: 0.6 }}
                  className={classes(
                    styles.col,
                    col.selected && styles.selected,
                    col.patched && styles.patched,
                    col.sorted && styles.sorted
                  )}
                  key={col.key}
                >
                  <span className={styles.value}>
                    {this.toString(col.value)}
                  </span>
                </motion.td>
              ))}
            </tr>
          ))}
          {/* Variable pointers */}
          {data.map(
            (row, i) =>
              isArray1D && ( // variable pointer only working for 1D arrays
                <AnimateSharedLayout>
                  <tr layout className={styles.row} key={i}>
                    {row.map((col) => (
                      <td
                        className={classes(styles.col, styles.variables)}
                        key={`vars-${col.key}`}
                      >
                        {col.variables.map((v) => (
                          <motion.p
                            layoutId={v}
                            key={v}
                            className={styles.variable}
                          >
                            {v}
                          </motion.p>
                        ))}
                      </td>
                    ))}
                  </tr>
                </AnimateSharedLayout>
              )
          )}
        </tbody>
      </motion.table>
    );
  }
}

export default Array2DRenderer;
