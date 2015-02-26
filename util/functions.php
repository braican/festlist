<?php

/**
 * include_svg
 * @param (string) svg : the svg to include
 * @param $return : whether to return the svg as a string or simply include the svg
 */
function include_svg( $svg, $return = false ){
    $svg_path = 'svg/' . $svg . '.svg';
    if($return){
        return file_get_contents($svg_path);
    }
    include( $svg_path );
}