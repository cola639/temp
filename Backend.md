Sub AddSingleQuotesToAllCells()
    Dim cell As Range
    For Each cell In Selection 
        If Not IsEmpty(cell.Value) Then
            cell.Value = "'" & cell.Value & "'"
        End If
    Next cell
End Sub


Sub AddSingleQuotesToAllCells_Force()
    Dim cell As Range
    For Each cell In Selection
        If Not IsEmpty(cell.Value) Then
            cell.NumberFormat = "@"           ' 强制为文本格式
            cell.Value = Chr(39) & cell.Value & Chr(39)   ' Chr(39) 就是英文单引号
        End If
    Next cell
End Sub
